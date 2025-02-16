from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

class InterviewQuestion(BaseModel):
    text: str = Field(description="The interview question text")
    good_answer_example: str = Field(description="Example of a good answer")
    bad_answer_example: str = Field(description="Example of a bad answer")

class InterviewQuestions(BaseModel):
    questions: List[InterviewQuestion]

class InterviewQuestionGenerator:
    def __init__(self, api_key: str, model_name: str = "gpt-3.5-turbo"):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model_name=model_name,
            openai_api_key=api_key
        )
        self.parser = PydanticOutputParser(pydantic_object=InterviewQuestions)
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are an elite headhunter with 20+ years of experience in uncovering candidates' potential, culture fit, and skill sets.
You must respond in a valid JSON format that matches the following schema:
{
    "questions": [
        {
            "text": "Question text here",
            "good_answer_example": "Example of a good answer here",
            "bad_answer_example": "Example of a bad answer here"
        }
    ]
}"""),
            HumanMessage(content="""Generate STAR-based interview questions for the candidate below, focusing on both technical depth and cultural alignment.

Candidate Resume Summary:
{resume_text}

Company Culture & Requirements:
{culture_values_and_job_requirements}

Remember to format your response as a valid JSON object matching the schema provided.
{format_instructions}""")
        ])

    async def generate_questions(
        self,
        resume_text: str,
        culture_values_and_job_requirements: str,
    ) -> List[InterviewQuestion]:
        formatted_prompt = self.prompt.format_messages(
            resume_text=resume_text,
            culture_values_and_job_requirements=culture_values_and_job_requirements,
            format_instructions=self.parser.get_format_instructions()
        )
        response = await self.llm.ainvoke(formatted_prompt)
        parsed_output = self.parser.parse(response.content)
        return parsed_output.questions
