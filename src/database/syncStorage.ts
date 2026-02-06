import { openSync } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import { migrate } from "drizzle-orm/op-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import schema from "./index";

export const getRemoteDb = () => {
	const remoteDb = openSync({
		name: "s1_global",
		url: "http://localhost:7017",
		// authToken: 'eyJhbGciOiJFZERTQSJ9.eyJzdWIiOiJpZDowMTljMTNlYy1iNzIyLTcwMDAtYjZhYy01ZDA4Yjk1NDVjZGMiLCJleHAiOjE3NzI0NTI4MDZ9.Ei-qx87D-ZLoACVT0Xiwkltroe_jo3jfcfSejlB4N8oC0j-bKlYtXtcPJbeArwu-BcS8FYSZPKiFcH3UX7IzDA',
		authToken:
			"eyJhbGciOiJFZERTQSJ9.eyJzdWIiOiJpZDowMTljMTNlYy1iNzIyLTcwMDAtYjZhYy01ZDA4Yjk1NDVjZGMiLCJleHAiOjE3NzI0NTI4MDZ9.Ei-qx87D-ZLoACVT0Xiwkltroe_jo3jfcfSejlB4N8oC0j-bKlYtXtcPJbeArwu-BcS8FYSZPKiFcH3UX7IzDA",
		libsqlSyncInterval: 2,
		// syncInterval: 1, // Optional, in seconds
		// encryptionKey: 'my encryption key', // Optional, will encrypt the database on device. Will add overhead to your queries
	});

	const drzlDb = drizzle(remoteDb, { schema });

	migrate(drzlDb, migrations)
		.then(() => console.log("migration success!"))
		.catch((e) => console.log(e));

	return drzlDb;
};
