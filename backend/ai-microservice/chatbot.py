from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv

load_dotenv()

def call_chatbot(query, expense = ''):

    model = ChatGoogleGenerativeAI(model='gemini-1.5-flash')

    history_file_path = 'D:\\Expensio2\\history.txt'
    chat_history_raw = []
    try:
        with open(history_file_path, 'r', encoding='utf-8') as f:
            chat_history_raw = f.readlines()
    except FileNotFoundError:
        # If the file doesn't exist, we start with an empty history.
        pass
    except UnicodeDecodeError:
        # If the file is corrupted or not in UTF-8, we start with a fresh history.
        # You might want to log this event for debugging.
        print(f"Warning: Could not decode {history_file_path}. Starting with a new history.")

    template = PromptTemplate(
        template='''
    You are a helpful financial advisor chatbot.
    Your job is to analyze the user’s expenses and provide intelligent advice on how to save money and optimize spending. Given expense data with details such as amount, category, description, merchant, and date, examine spending patterns and suggest practical ways the user can reduce expenses or avoid unnecessary spending. Provide clear, actionable recommendations related to each expense or overall categories. Be friendly, concise, and personalized.
    If no expenses are provided just give advices as per the question.
    ''', input_variables=['expense']
    )

    template = ChatPromptTemplate([
        ('system', '''
    You are a helpful financial advisor chatbot.
    Your job is to analyze the user’s expenses and provide intelligent advice on how to save money and optimize spending. Given expense data in Indian Rupees with details such as amount, category, description, merchant, and date, examine spending patterns and suggest practical ways the user can reduce expenses or avoid unnecessary spending. Provide clear, actionable recommendations related to each expense or overall categories. Be friendly, concise, and personalized.
    If no expenses are provided just give advices as per the question.
        '''),
        MessagesPlaceholder(variable_name='chat_history'),
        ('human', '{query} {expense}')
    ])

    # Reconstruct chat history from raw lines
    chat_history = []
    for line in chat_history_raw:
        if line.startswith('Human: '):
            chat_history.append(HumanMessage(content=line.replace('Human: ', '', 1).strip()))
        elif line.startswith('AI: '):
            chat_history.append(AIMessage(content=line.replace('AI: ', '', 1).strip()))

    prompt = template.invoke({
        'expense': expense,
        'chat_history': chat_history,
        'query': query
    })
    
    result = model.invoke(prompt)
    
    # Add the latest interaction to the history before writing
    chat_history.append(HumanMessage(f'{query} {expense}'))
    chat_history.append(AIMessage(result.content))

    # Overwrite the history file with the full, updated history
    with open(history_file_path, 'w', encoding='utf-8') as file:
        for message in chat_history:
            if isinstance(message, HumanMessage):
                file.write(f"Human: {message.content}\n")
            elif isinstance(message, AIMessage):
                file.write(f"AI: {message.content}\n")

    return result

# print(call_chatbot("how to save my money"))
