import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
import { adminDb } from "./firebaseAdmin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const fetchResults: any = async (id:string) => {
    const api_key = process.env.BRIGHTDATA_API_KEY;

    const res = await fetch(`https://api.brightdata.com/dca/dataset?id=${id}` , {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${api_key}`,
        },
    });

    const data = await res.json();

  //  console.log('DEBUG 1')
    if(data.status === "building" || data.status === "collecting") {
        console.log("NOT COMPLETE YET, TRYING AGAIN...");
        return fetchResults(id);
    }
  //  console.log('DEBUG 2') #if stuck use this way.
    return data;
}

export const onScraperComplete = functions.https.onRequest(
    async (request, response) => {
        console.log("SCRAPE COMPLETE >>>> : ", request.body);
  
        const { success, id, finished } = request.body;

        if (!success) {
            await adminDb.collection('searches').doc(id).set({
                status: "error",
                updatedAt: finished, 
            }, {
                merge: true,
            })
        }

        const data = await fetchResults(id);

        await adminDb.collection('searches').doc(id).set({
            status: "complete",
            updatedAt: finished,
            results: data,
        },{
            merge: true,
        })

        console.log("FINISHED SCRAPING");

        console.log("WOOHOOO FULL CIRCLE!!!")
  
   // functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Scraping Function Finished!");
});


// https://daa6-2405-201-1011-7028-a15e-d517-5d1b-86bc.ngrok-free.app/brightdata-yt-build-31857/us-central1/onScraperComplete