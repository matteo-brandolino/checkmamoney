import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

const connectDB = async () => {
  if (dbInstance === null) {
    try {
      dbInstance = await Database.load(
        "postgresql://postgres:checkmamoney@localhost:5432/checkmamoney"
      );
      console.log("DB ok");
    } catch (error) {
      console.error("DB ko", error);
      return null;
    }
  }
  return dbInstance;
};

export default connectDB;
