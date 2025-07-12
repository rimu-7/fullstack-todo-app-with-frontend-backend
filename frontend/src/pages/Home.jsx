import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">End-to-End Todo App</h1>
                <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8">
                    A secure, full-stack Todo management system with user authentication and personalized task tracking.
                </p>
                <Link to="/login">
                    <button className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition">
                        Get Started
                    </button>
                </Link>
            </section>

            {/* About Section */}
            <section className="py-16 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About This Project</h2>
                <p className="text-lg text-gray-300 mb-6">
                    This is an <span className="font-semibold ">End-to-End Todo Application</span> built with modern technologies like React, Node.js, Express, and MongoDB.
                    It provides complete user authentication with JWT and enables users to create, update, complete, and delete their personal todos.
                    All operations are securely tied to each user's account.
                </p>
                <p className="text-lg text-gray-300">
                    Whether you're on mobile or desktop, your tasks will stay in sync and easy to manage with a clean, intuitive interface.
                </p>
            </section>

            {/* Features Section */}
            <section className="bg-gray-100  text-black py-16 px-4">
                <h3 className="text-3xl  font-bold text-center mb-10">Key Features</h3>
                <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle size={40} className="text-blue-600 mb-4" />
                        <h4 className="font-semibold text-xl mb-2">User Authentication</h4>
                        <p className="text-gray-600">Secure login and registration with JWT token-based authentication.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle size={40} className="text-blue-600 mb-4" />
                        <h4 className="font-semibold text-xl mb-2">Real-Time Task Management</h4>
                        <p className="text-gray-600">Create, update, complete, and delete todos with instant updates and beautiful UI.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle size={40} className="text-blue-600 mb-4" />
                        <h4 className="font-semibold text-xl mb-2">End-to-End Architecture</h4>
                        <p className="text-gray-600">Complete full-stack solution from backend API to responsive frontend with seamless integration.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center py-4">
                &copy; {new Date().getFullYear()} End-to-End Todo App. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
