import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const mySanityClient = sanityClient({
    projectId: 'fk1hqv73',
    dataset: 'production',
    apiVersion: '2022-03-10',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});


const builder = imageUrlBuilder(mySanityClient);


export const sanityUrlFor = (source: any) => builder.image(source).url();

