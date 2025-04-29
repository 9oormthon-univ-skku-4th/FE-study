import React from "react";
import loadable from "@loadable/component";
import { Switch, Route, Redirect } from 'react-router-dom';


const LogIn = loadable(() => import("@pages/LogIn"));
const SignUp = loadable(() => import("@pages/SignUp"));

const Workspace = loadable(() => import("@layouts/Workspace"));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
  // Swith -  여러 개 라우터 중 하나 화면에 표시 
  // Route - 컴포넌트를 화면에 띄움 
  // Redirect - 다른 페이지로 돌려주는 역할 
}

export default App;