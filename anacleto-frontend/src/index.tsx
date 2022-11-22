/* Import to debug useless renderings in app!
import './wdyr';
*/

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Anacleto as AnacletoFrontend } from './Anacleto'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import contextReducer from "./reducers/context";
import metadataReducer from "./reducers/metadata";

const reduxStore = configureStore({
  reducer: {
    context: contextReducer,
    metadata: metadataReducer,
  }
});
export const Anacleto = () => {
  return (
    <BrowserRouter>
      <Provider store={reduxStore}>
        <AnacletoFrontend />
      </Provider>
    </BrowserRouter>
  )
}
