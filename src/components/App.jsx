import { Component } from "react";
import Button from './Button/Button'; 
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import css from './App.module.css';
import { getAPI } from 'pixabay-api';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    searchQuery: '',
    currentPage: 1,
    images: [],
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  async componentDidUpdate(_prevProps, prevState) {
    const { searchQuery, currentPage } = this.state;

    if (
      prevState.searchQuery !== searchQuery ||
      prevState.currentPage !== currentPage
    ) {
      await this.fetchImages();
    }
  }

  fetchImages = async () => {
    this.setState({ isLoading: true, isError: false });

    const { searchQuery, currentPage } = this.state;

    try {
      const response = await getAPI(searchQuery, currentPage);
      console.log(response);
      const { totalHits, hits } = response;

      this.setState(prevState => ({
        images: currentPage === 1 ? hits : [...prevState.images, ...hits],
        isLoading: false,
        isEnd: prevState.images.length + hits.length >= totalHits,
      }));

      if (hits.length === 0) {
        toast('No images found. Try a different search.');
        return;
      }
      if (currentPage === 1) {
        toast(`Hooray! We found ${totalHits} images!`);
      }
    } catch (error) {
      this.setState({ isLoading: false, isError: true });
      toast.error(`An error occurred while fetching data: ${error}`);
    }
  };

  handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();

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
    if (normalizedQuery !== normalizedCurrentQuery) {
      this.setState({
        searchQuery: normalizedQuery,
        currentPage: 1,
        images: [],
        isEnd: false,
      });
    }
  };

  handleLoadMore = () => {
    if (!this.state.isEnd) {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  } else {
  toast("You've reached the end fo the search results.");
  }
  };
  
render() {
  const { images, isLoading, isError, isEnd } = this.state;
  return (
    <div className={css.App}>
      <Searchbar onSubmit={this.handleSearchSubmit} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={this.handleLoadMore} />
      )}
      {isError && toast.error("Something went wrong. Please try again later.")}

      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  );
  }
}
export default App;