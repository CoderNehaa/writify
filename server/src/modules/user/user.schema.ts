import mongoose from "mongoose";
import { EUserRoles, IUser } from "./user.type";
import { COLLECTION_NAMES } from "../../constants/collections";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: EUserRoles,
      default: EUserRoles.USER,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // TODO:Hide in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// partial unique indexes (for non-deleted users)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);
userSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Prevent sending password in user object
userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret.password;
    return ret;
  },
});

// Pre-save middleware: hash password
userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password as string, salt);
  next();
});

// Pre-update middleware: hash if password updated
userSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  async function (next) {
    const update = this.getUpdate() as any;
    if (update?.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    }
    next();
  }
);

// Apply middleware to filter deleted users from queries
function addNotDeletedFilter(this: any, next: any) {
  const filter = this.getFilter();

  // Allow explicit override via { includeDeleted: true }
  if ((this as any).mongooseOptions()?.includeDeleted) return next();

  // Add isDeleted:false filter if not already specified
  if (filter.isDeleted === undefined) {
    this.setQuery({ ...filter, isDeleted: false });
  }
  next();
}

userSchema.pre("find", addNotDeletedFilter);
userSchema.pre("findOne", addNotDeletedFilter);
userSchema.pre("countDocuments", addNotDeletedFilter);
userSchema.pre("findOneAndUpdate", addNotDeletedFilter);

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model(COLLECTION_NAMES.USER, userSchema);
export default UserModel;
