from fastapi import FastAPI, Body
import pandas as pd
import traceback
from openai import OpenAI
import chromadb
import traceback
import numpy as np
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(dotenv_path=".env", override=True)


GITA_DATASET_PATH = "data/bhagavad_gita/shlokas.csv"
DEFAULT_SHLOKA_COUNT = 5
DEFAULT_OPENAI_MODEL = "gpt-4o"

chroma_client = chromadb.PersistentClient()
collection = chroma_client.get_or_create_collection(name="bhagavad_gita")
app = FastAPI()
openai = OpenAI()


def load_dataset(path: str) -> pd.DataFrame:
    """
    Load the dataset from the given path and return it as a pandas DataFrame.

    Args:
        path (str): The path to the dataset.

    Returns:
        pd.DataFrame: The dataset as a pandas DataFrame
    """
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print("File not found. Please check the path.")
        traceback.print_exc()
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return None


def load_bhagavad_gita():
    dataset_path = "data/bhagavad_gita/shlokas_with_context_v2.csv"
    return load_dataset(path=dataset_path)


def load_bhagavad_gita_into_db():
    """
    Load the Bhagavad Gita dataset into the Chroma database.

    Args:
        None

    Returns:
        int: The number of documents loaded into the database.
    """
    try:
        df = load_bhagavad_gita()
        documents = []
        ids = []

        # only for testing
        count = 10
        idx = 0

        for _, row in df.iterrows():
            shloka_text = f"""
                ID: {row["ID"]}
                Chapter: {row['Chapter']}
                Verse: {row['Verse']}
                Shloka: {row['Shloka']}
                Hindi Meaning: {row['HinMeaning']}
                English Meaning: {row['EngMeaning']}
                Word Meanings: {row['WordMeaning']}
                Context: {row['context']}
            """

            doc_id = row["ID"]
            documents.append(shloka_text)
            ids.append(doc_id)

            ## testing
            if idx > count:
                break
            idx += 1

        collection.upsert(documents=documents, ids=ids)
        return len(documents)
    except Exception as e:
        print(f"An error occurred when loading the dataset into the database: {e}")
        traceback.print_exc()
        return 0


def query_shloka(query: str, n=5):
    """
    Query the Bhagavad Gita dataset for the given query.

    Args:
        query (str): The query to search for in the dataset.

    Returns:
        list: The list of documents matching the query.
    """
    try:
        results = collection.query(query_texts=[query], n_results=n)
        documents = results["documents"][0]
        return documents
    except Exception as e:
        print(f"An error occurred when querying the dataset: {e}")
        traceback.print_exc()
        return []


def ask_gita(query: str, shloka_count=DEFAULT_SHLOKA_COUNT) -> str:
    """
    Query the Bhagavad Gita dataset for the given query.

    Args:
        query (str): The query to search for in the dataset.

    Returns:
        str: The response to the query.
    """
    shlokas = query_shloka(query, n=shloka_count)

    if not shlokas:
        return "I couldn't find any relevant shlokas for your query. Please try again with a different query."

    sholkas_text = "\n".join(shlokas)

    system_prompt = f"""
                You are Bhagavad Gita Advisor and you are explaining the following shloka to a friend who is going through a tough time.
                Given a user query and some Bhagavad Gita shlokas, provide a response that helps the user understand the teachings of the Gita.
                The answer should be relevant and applicable to the user's situation.
                Be kind, respectful, and empathetic in your response.
            """

    user_prompt = f"""
                User Query: {query}
                Shlokas Text: {sholkas_text}
                """

    response = openai.chat.completions.create(
        model=DEFAULT_OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.84,
    )

    return response.choices[0].message.content


def get_random_shloka() -> str:
    """
    Get a random Shloka from the list.

    Returns:
        str: A random Shloka.
    """
    try:
        shlokas_df = load_bhagavad_gita()
        random_shloka = shlokas_df.sample(n=1).iloc[0]
        shloka_text = f"""
            ID: {random_shloka["ID"]}
            Chapter: {random_shloka['Chapter']}
            Verse: {random_shloka['Verse']}
            Shloka: {random_shloka['Shloka']}
            Hindi Meaning: {random_shloka['HinMeaning']}
            English Meaning: {random_shloka['EngMeaning']}
            Word Meanings: {random_shloka['WordMeaning']}
            Context: {random_shloka['context']}
        """

        system_prompt = f"""
                You are Bhagavad Gita Advisor and you are explaining the following shloka to a friend who is going through a tough time.
                Given a user query and some Bhagavad Gita shlokas, provide a response that helps the user understand the teachings of the Gita.
                The answer should be relevant and applicable to the user's situation.
                Be kind, respectful, and empathetic in your response.
            """

        user_prompt = f"""
                        Provide the Shloka and a detailed explanation of the shloka.
                        The response should be in markdown, in the following format:
                        Shloka: [The Shloka as it is given]
                        Explanation: [A detailed explanation of the shloka]

                        Here is the Shloka Text:
                        Shlokas Text: {shloka_text}
                        """

        response = openai.chat.completions.create(
            model=DEFAULT_OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.84,
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"An error occurred when getting a random Shloka: {e}")
        traceback.print_exc()
        return "I couldn't find any shlokas at the moment. Please try again later."


def get_advice(life_situation: str) -> str:
    """
    Get advice based on the given life situation.

    Args:
        life_situation (str): The life situation described by the user.

    Returns:
        str: Advice in markdown format.
    """
    return ask_gita(life_situation)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load the Bhagavad Gita dataset into the database on server startup.
    """
    print("Loading Bhagavad Gita dataset into the database...")
    num_documents = load_bhagavad_gita_into_db()
    print(f"Loaded {num_documents} documents into the database.")
    yield
    # Cleanup code if needed


app = FastAPI(lifespan=lifespan)


class AdviceRequest(BaseModel):
    life_situation: str


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get_random_shloka")
def random_shloka():
    """
    Endpoint to get a random Shloka.

    Returns:
        str: A random Shloka.
    """
    return {"shloka": get_random_shloka()}


@app.post("/get_advice")
async def advice(request: AdviceRequest = Body(...)):
    """
    Endpoint to get advice based on the given life situation.

    Args:
        request (AdviceRequest): The request object containing the life situation.

    Returns:
        str: Advice in markdown format.
    """
    try:
        life_situation = request.life_situation
        if not life_situation:
            return {"error": "Life situation is required."}
        return {"advice": get_advice(life_situation)}
    except Exception as e:
        print(f"An error occurred while processing the request: {e}")
        traceback.print_exc()
        return {"error": "An error occurred while processing the request."}
