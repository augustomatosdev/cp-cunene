import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        const { email, password } = credentials as any;
        return await signInWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            if (userCredentials.user) {
              return userCredentials.user;
            }
            return null;
          })
          .catch((error) => {
            throw new Error(error.code);
          });
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }: any) {
      //   update token with ID for front-end if user exists
      if (user) {
        token.uid = user.uid;
        return token;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token.uid) {
        const userDoc = await getDocs(
          query(collection(db, "users"), where("email", "==", token.email))
        );

        const userData = {
          name: userDoc.docs[0].data().name,
          role: userDoc.docs[0].data().role,
          email: userDoc.docs[0].data().email,
        };

        if (userDoc.docs.length > 0) {
          session.user = userData;
          session.user.id = token.uid;
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
