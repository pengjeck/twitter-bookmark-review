export interface User {
    name: string;
    screenName: string;
    profileImage: string;
}

export interface Tweet {
    user: User;
    id: string;
    fullText: string;
    createAt: string;
}
