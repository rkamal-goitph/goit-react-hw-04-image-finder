import React, {useState, useEffect } from "react";
import Button from './Button/Button'; 
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import css from './App.module.css';
import { getAPI } from 'pixabay-api';
import toast, { Toaster } from 'react-hot-toast';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
 
  useEffect(() => {
    const fetchImages = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await getAPI(searchQuery, currentPage);
        const { totalHits, hits } = response;
      
        if (hits.length === 0) {
          toast.error('No images found. Try a different search.');
          setIsLoading(false);
          return;
        }
        if (currentPage === 1) {
          toast.success(`Hooray! We found ${totalHits} images!`);
        }
        setImages(prev => (currentPage === 1 ? hits : [...prev, ...hits]));
        setIsEnd(currentPage * 12 >= totalHits);
      } catch (error) {
        setIsError(true);
        toast.error(`An error occurred while fetching data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = searchQuery.toLowerCase();

    if (normalizedQuery === '') {
      toast('Empty string is not a valid search query. Please type again.');
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery) {
      toast(
        'Search query is the same as the previous one. Please provide a new search query.'
      );
      return;
    }
    // Only update the state and fetch images if the new query is different
    
    setSearchQuery(normalizedQuery);
    setCurrentPage(1);
    setImages([]);
    setIsEnd(false);
    
  };
  

  const handleLoadMore = () => {
    if (!isEnd) {
      setCurrentPage(prevState => prevState + 1);
    } else {
      toast("You've reached the end fo the search results.");
    };
  }


 
    return (
      <div className={css.App}>
        <Searchbar onSubmit={handleSearchSubmit} />
        <ImageGallery images={images} />
        {isLoading && <Loader />}
        {!isLoading && !isError && images.length > 0 && !isEnd && (
          <Button onClick={handleLoadMore} />
        )}
        {isError && toast.error("Something went wrong. Please try again later.")}

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    );
  };




export default App;