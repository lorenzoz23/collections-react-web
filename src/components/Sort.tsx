import React from 'react';
import { movie } from './HomePage';

export const Sort = ({ children, by }: { children: any; by: string }) => {
  const compareMpaaAsc = (a: string, b: string) => {
    if (a === 'NC-17' && b !== 'NC-17') {
      return 1;
    }
    if (b === 'NC-17' && a !== 'NC-17') {
      return -1;
    }
    if (a === 'NR' && b !== 'NR') {
      return -1;
    }
    if (b === 'NR' && a !== 'NR') {
      return 1;
    } else {
      if (a < b) return -1;
      if (a > b) return 1;
      if (a === b) return 0;
      return 0;
    }
  };

  const compareMpaaDesc = (a: string, b: string) => {
    if (a === 'NC-17' && b !== 'NC-17') {
      return -1;
    }
    if (b === 'NC-17' && a !== 'NC-17') {
      return 1;
    }
    if (a === 'NR' && b !== 'NR') {
      return 1;
    }
    if (b === 'NR' && a !== 'NR') {
      return -1;
    } else {
      if (a < b) return 1;
      if (a > b) return -1;
      if (a === b) return 0;
      return 0;
    }
  };

  const compare = (a: any, b: any) => {
    const movieA: movie = a.props.movie as movie;
    const movieB: movie = b.props.movie as movie;

    switch (by) {
      case 'nameAsc':
        if (movieA.name < movieB.name) return -1;
        if (movieA.name > movieB.name) return 1;
        if (movieA.name === movieB.name) return 0;
        break;
      case 'runtimeAsc':
        if (movieA.runtime < movieB.runtime) return -1;
        if (movieA.runtime > movieB.runtime) return 1;
        if (movieA.runtime === movieB.runtime) return 0;
        break;
      case 'mpaaAsc':
        return compareMpaaAsc(movieA.rating, movieB.rating);
      case 'starCountAsc':
        if ((movieA.starCount || 0) < (movieB.starCount || 0)) return -1;
        if ((movieA.starCount || 0) > (movieB.starCount || 0)) return 1;
        if ((movieA.starCount || 0) === (movieB.starCount || 0)) return 0;
        break;
      case 'nameDesc':
        if (movieA.name < movieB.name) return 1;
        if (movieA.name > movieB.name) return -1;
        if (movieA.name === movieB.name) return 0;
        break;
      case 'runtimeDesc':
        if (movieA.runtime < movieB.runtime) return 1;
        if (movieA.runtime > movieB.runtime) return -1;
        if (movieA.runtime === movieB.runtime) return 0;
        break;
      case 'mpaaDesc':
        return compareMpaaDesc(movieA.rating, movieB.rating);
      case 'starCountDesc':
        if ((movieA.starCount || 0) < (movieB.starCount || 0)) return 1;
        if ((movieA.starCount || 0) > (movieB.starCount || 0)) return -1;
        if ((movieA.starCount || 0) === (movieB.starCount || 0)) return 0;
        break;
      default:
        if (movieA.name < movieB.name) return -1;
        if (movieA.name > movieB.name) return 1;
        if (movieA.name === movieB.name) return 0;
        break;
    }
    return 0;
  };

  if (!by) {
    return children;
  }
  return React.Children.toArray(children).sort(compare);
};
