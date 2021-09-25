import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';

import Conference from './Conference';


export default function Meet() {
  const history = useHistory();

  return (
    <Switch>
      <Route exact path="/meet/">
        <h1>Meeting</h1>
        <p>Form with meeting id?</p>
        <button onClick={() => history.push('/meet/ClassicDecembersRetainEventually')}>
          Join Meeting
        </button>
      </Route>
      <Route path="/meet/:meetingId">
        <Conference />
      </Route>
    </Switch>
  );
}
