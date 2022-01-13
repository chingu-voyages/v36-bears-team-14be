export interface IUser
{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    bio: string;
    recipes: [
        {
            recipeId: string, 
            Date: Date
        }
    ]
}



