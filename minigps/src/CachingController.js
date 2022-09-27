import { useDispatch, useSelector, connect } from 'react-redux';

import {
  geofencesActions, groupsActions,
} from './store';
import { useEffectAsync } from './reactHelper';
let base64 = require('base-64');

const CachingController = () => {
  const authenticated = useSelector((state) => !!state.session.user);
  const dispatch = useDispatch();

  useEffectAsync(async () => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    if (authenticated) {
      const response = await fetch('http://159.65.134.221:8082/api/geofences', {headers: headers});
      if (response.ok) {
        dispatch(geofencesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    if (authenticated) {
      const response = await fetch('http://159.65.134.221:8082/api/groups', {headers: headers});
      if (response.ok) {
        dispatch(groupsActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  return null;
};

export default connect()(CachingController);
