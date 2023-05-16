"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDb = void 0;
const admin = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const serviceAccount = require("./serviceAccountKey.json");
if (!(0, app_1.getApps)().length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const adminDb = admin.firestore();
exports.adminDb = adminDb;
//# sourceMappingURL=firebaseAdmin.js.map