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
        image: "no_alternatives.jpg",
        description: "Increase the reward of a question in 300 points, but hides all the alternatives",
        useCondition: "Can be used anytime before alternatives been shown",
        color: "blue"
    },
    {
        name: "I think you know this one",
        image: "nerd.png",
        description: "Force another player of your choice to answer this question. If they answer incorrectly, they lose points 1.5xequal to the question’s value.",
        useCondition: "Can be used whenever the host asks a question.",
        color: "blue"
    },
    {
        name: "Swap questions",
        image: "swap.jpg",
        description: "Swap a question with the other team (same point value)",
        useCondition: "Both swapped questions must be answered when this card is used",
        color: "blue"
    },
    {
        name: "Show me the files!",
        image: "files.webp",
        description: "At the end of the game you can ask the host to tell how much points one of players lost",
        useCondition: "",
        color: "white"
    },
    {
        name: "I changed my mind",
        image: "changed_mind.avif",
        description: "If you don't like the question you got, you can use this card to get a new one",
        useCondition: "",
        color: "white"
    },
    {
        name: "Some times we need a second chance",
        image: "happy_couple.webp",
        description: "Gives you another opportunity to answer a question correctly",
        useCondition: "You can use this card immediately after giving an incorrect answer to a question.",
        color: "white"
    },
    {
        name: "I will call my MOM!",
        image: "phone.jpg",
        description: "Force any player to call their mother for help in one question, that player has to follow their mother advice no matter what",
        useCondition: "Player has 3 minutes to comply, failure will result to lose the question, if player has no mother they can call someone else and say 'you are like a mother to me... can I ask you a question?'",
        color: "black"
    },
    {
        name: "Silence",
        image: "silence.png",
        description: "Choose a player to not awnser a question next turn.",
        useCondition: "",
        color: "black"
    },
    {
        name: "Your game my rules",
        image: "rule.webp",
        description: "Create a new rule that all adversaries must follow until the end of the game. Breaking the rule will result in a penalty of 50 points.",
        useCondition: "The host must approve the rule",
        color: "black"
    },
    {
        name: "I need less choices",
        image: "choices.webp",
        description: "Makes the host eliminate 2 wrong alternatives, question loses 50 points in value",
        useCondition: "Can be used anytime host shows alternatives",
        color: "green"
    },
    {
        name: "A new path to victory",
        image: "new_path.jpg",
        description: "Add a new category to your question board",
        useCondition: "",
        color: "green"
    },
    {
        name: "Do you have any recommendations?",
        image: "recommendation.jpg",
        description: "Ask the host to recommend a question or action for you.",
        useCondition: "",
        color: "green"
    },
    {
        name: "Double or nothing",
        image: "roulette.png",
        description: "Doubles the value of a question, but if you get it wrong you lose double the points",
        useCondition: "",
        color: "red"
    },
    {
        name: "Not so fast",
        image: "speed.jpg",
        description: "Halves the value of a question",
        useCondition: "Can be used anytime before scoring a question",
        color: "red"
    },
    {
        name: "I know this one!",
        image: "nerd.png",
        description: "You can answer for another player.",
        useCondition: "",
        color: "red"
    }
     
]