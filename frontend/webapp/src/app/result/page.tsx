"use client";

import { useEffect, useRef, useState } from 'react';
import { get, set } from 'idb-keyval';
import { Base64 } from '@/shared/types/basic';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { IoCameraOutline } from 'react-icons/io5';

const ResultPage = () => {
    const router = useRouter();
    const [transformedPhoto, setTransformedPhoto] = useState<Base64>("");
    const [foodCategory, setFoodCategory] = useState<Base64>("");
    const photoRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        get("response").then((data) => {
            set("user_photo", data.transformed_photo);
            setTransformedPhoto(data.transformed_photo);
            setFoodCategory(data.food_category);
        }).catch((error) => {
            console.error("Error reading from IndexedDB", error);
        });
    }, []);

    useEffect(() => {
        const photo = photoRef.current;
        if (!photo || !transformedPhoto) return;
        const ctx = photo.getContext("2d");
        const image = new Image();
        image.src = transformedPhoto;
        image.onload = () => {
            photo.width = 300;
            photo.height = 300;
            if (ctx) ctx.drawImage(image, 0, 0, photo.width, photo.height);
        };
        if (photoRef.current) photoRef.current.style.display = 'block';

    }, [transformedPhoto]);

    return (
        <main className="flex min-h-svh flex-col p-6">
            <h1 className="text-2xl uppercase text-right">result</h1>
            <div className="py-4"></div>
            <div className='my-auto'>
                {photoRef && <canvas
                    className="border-black hidden border-8 aspect-square m-auto"
                    ref={photoRef}>
                </canvas>}
                <div className="py-4"></div>
                <div className='px-6'>
                    <div>
                        {/* <h2 className='font-mono uppercase'>food category:</h2> */}
                        <p className="uppercase">{foodCategory}</p>
                    </div>
                </div>
                <div className="py-8"></div>

                <div className="flex w-full mb-8 justify-evenly">
                    <Button size="lg_icon" variant="secondary" onClick={() => router.push('/scanIngredients')}>
                        <IoCameraOutline size={60} />
                    </Button>
                </div>
            </div>
        </main >
    );
};

export default ResultPage;