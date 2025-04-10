// Redirecteur vers le nouveau modèle User implémenté avec pattern singleton
import { UserModel } from "../app/lib/models";
import { IUser } from "../app/lib/interfaces/user.interface";

export type { IUser };
export default UserModel;
