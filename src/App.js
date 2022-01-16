import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './parts/Layout';
import SimpleCubic from './pages/SimpleCubic';
import SimpleDrawingLine from './pages/SimpleDrawing/Lines';
import SimpleDrawingText from './pages/SimpleDrawing/Text';
import AnimationCloth from './pages/Animation/Cloth';
import AnimationKeyFrames from './pages/Animation/KeyFrames';
import AnimationSkinningMorph from './pages/Animation/Skinning/Morph';

const App = () => {
  const routes = (
    <Switch>
      <Route path="/" exact component={SimpleCubic} />
      <Route path="/simple/line" exact component={SimpleDrawingLine} />
      <Route path="/simple/text" exact component={SimpleDrawingText} />
      <Route path="/animation/cloth" exact component={AnimationCloth} />
      <Route path="/animation/keyframes" exact component={AnimationKeyFrames} />
      <Route path="/animation/skinning/morph" exact component={AnimationSkinningMorph} />
      <Redirect to="/" />
    </Switch>
  )

  return (
    <div className="App">
      <Layout>
        {routes}
      </Layout>
    </div>
  );
}

export default App;
