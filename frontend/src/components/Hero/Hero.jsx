import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Clothw from '../../assets/hero/women.jpg';
import Male from '../../assets/hero/malet.jpg';
import Kid from '../../assets/hero/kids.jpg';

const ImageList = [
    {
        id: 1,
        img: Clothw,
        title: "Upto 50% off on all Women's Wear",
        description:
            "A stylish women’s outfit with a soft, comfortable feel and a modern look. Perfect for casual outings or everyday wear, featuring a flattering fit and simple elegant details.",
    },
    {
        id: 2,
        img: Male,
        title: "Upto 50% off on all Men's Wear",
        description:
            "A comfortable and stylish men’s outfit with a clean modern design, suitable for everyday wear or casual occasions. Made for a relaxed fit and easy styling.",
    },
    {
        id: 3,
        img: Kid,
        title: "Upto 50% off on all Kids' Wear",
        description:
            "A cute and comfortable kids’ outfit designed for everyday activity and play, featuring a soft feel, simple style, and a fun youthful look.",
    },
];

const Hero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const heroItem = ImageList[activeIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % ImageList.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className='relative overflow-hidden bg-gray-100 dark:bg-gray-950 dark:text-white duration-200'>
            <div className='absolute inset-0 bg-primary/10 pointer-events-none' />

            <div className='container mx-auto px-4 py-12 sm:px-6 lg:px-10'>
                <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 items-center'>
                    <div className='space-y-6'>
                        <span className='inline-flex rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary'>
                            Best Seller
                        </span>
                        <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl'>
                            {heroItem.title}
                        </h1>
                        <p className='max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg'>
                            {heroItem.description}
                        </p>
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Link to='/register' className='inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white shadow-xl transition hover:bg-secondary'>
                                Shop Now
                            </Link>
                            <Link to='/register' className='inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white'>
                                Explore Collection
                            </Link>
                        </div>
                        <div className='flex gap-2'>
                            {ImageList.map((item, index) => (
                                <button
                                    key={item.id}
                                    type='button'
                                    aria-label={`Show slide ${index + 1}`}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-3 w-3 rounded-full transition ${
                                        index === activeIndex ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <div className='relative w-full max-w-xl'>
                            <div className='absolute -inset-x-6 -top-10 h-72 rounded-full bg-primary/20 blur-3xl' />
                            <img
                                src={heroItem.img}
                                alt={heroItem.title}
                                className='relative w-full rounded-[2rem] object-cover shadow-2xl'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;