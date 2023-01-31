import React, { Suspense } from "react";
import type { FunctionComponent } from "react";

import RouterConfig from "./router";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "@/assets/styles/normalize";

const App: FunctionComponent = () => {
  console.log(111);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div>加载中</div>}>
          <RouterConfig />
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
