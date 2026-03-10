import { MongoClient, type MongoClientOptions, ServerApiVersion } from 'mongodb';

export function createMongoClient(uri: string): MongoClient {
    const isAtlasUri = uri.startsWith('mongodb+srv://') || uri.includes('.mongodb.net');
    const options: MongoClientOptions = isAtlasUri
        ? {
            serverApi : {
                version           : ServerApiVersion.v1,
                strict            : true,
                deprecationErrors : true
            }
        }
        : {};

    return new MongoClient(uri, options);
}