import React, {useState} from "react";
import { PropTypes } from 'prop-types';
import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
    const [query, setQuery] = useState('');

    const handleChange = event => {
        setQuery(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(query);
        setQuery('');
    }

    return (
        <header className={css.searchbar}>
            <form className={css.form} onSubmit={handleSubmit}>
                <button type="submit" className={css.button}>
                    <span className={css.buttonLabel}>Search</span>
                </button>
                <input
                    className={css.input}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={query}
                    onChange={handleChange}
                />
            </form>
        </header>
    );
};

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}; 
export default Searchbar;


    