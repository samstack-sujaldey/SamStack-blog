import { User } from "@/lib/models/model";
import { connect } from "../mongoDB/mongoose";

type EmailAddressObj = {
  email_address: string;
};

export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  img_url: string,
  email_addresses: EmailAddressObj[],
  username: string,
) => {
  try {
    await connect();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: img_url,
          email: email_addresses[0].email_address,
          username,
        },
      },
      { new: true, upsert: true },
    );
    return user;
  } catch (error) {
    console.log("Error creating or updating user : ", error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log("Error while deleting User : ", error);
    return false;
  }
};
