export type WildCardType = {
    name:string;
    image:string;
    description:string;
    useCondition:string;
    color:string;
}

export const wildCardLibrary:WildCardType[] = [
    {
        name: "No more alternatives",
        image: "https://placehold.co/300x200",
        description: "Increase the reward of a question in 300 points, but hides all the alternatives",
        useCondition: "Can be used anytime before alternatives been shown",
        color: "blue"
    },
    {
        name: "I think you know this one",
        image: "https://placehold.co/300x200",
        description: "Force another player of your choice to answer this question. If they answer incorrectly, they lose points equal to the question’s value.",
        useCondition: "Can be used whenever the host asks a question.",
        color: "blue"
    },
    {
        name: "Show me the files!",
        image: "https://placehold.co/300x200",
        description: "At the end of the game you can ask the host to tell how much points one of players lost",
        useCondition: "",
        color: "white"
    },
    {
        name: "I will call my MOM!",
        image: "https://placehold.co/300x200",
        description: "Force any player to call their mother for help in one question, that player has to follow their mother advice no matter what",
        useCondition: "Player has 2 minutes to comply, failure will result to lose the question, if player has no mother they can call someone else and say 'you are like a mother to me... can I ask you a question?'",
        color: "black"
    },
    {
        name: "I need less choices",
        image: "https://placehold.co/300x200",
        description: "Makes the host eliminate 2 wrong alternatives, question loses 50 points in value",
        useCondition: "Can be used anytime host shows alternatives",
        color: "green"
    },
     {
        name: "Swap questions",
        image: "https://placehold.co/300x200",
        description: "Swap a question with the other team (same point value)",
        useCondition: "Both swapped questions must be answered when this card is used",
        color: "blue"
    },
    


]