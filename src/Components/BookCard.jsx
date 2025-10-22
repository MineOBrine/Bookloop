import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-500 mt-2">{book.genre}</p>
    </div>
  );
};

export default BookCard;
