// import { getCurrentDBConn } from './connections';
import { sqlectron } from '../api';

export const FETCH_SCHEMAS_REQUEST = 'FETCH_SCHEMAS_REQUEST';
export const FETCH_SCHEMAS_SUCCESS = 'FETCH_SCHEMAS_SUCCESS';
export const FETCH_SCHEMAS_FAILURE = 'FETCH_SCHEMAS_FAILURE';

export function fetchSchemasIfNeeded(database) {
  return (dispatch, getState) => {
    if (shouldFetchSchemas(getState(), database)) {
      dispatch(fetchSchemas(database));
    }
  };
}

function shouldFetchSchemas(state, database) {
  const schemas = state.schemas;
  if (!schemas) return true;
  if (schemas.isFetching) return false;
  if (!schemas.itemsByDatabase[database]) return true;
  return schemas.didInvalidate;
}

function fetchSchemas(database) {
  return async (dispatch) => {
    dispatch({ type: FETCH_SCHEMAS_REQUEST, database });
    try {
      // const dbConn = getCurrentDBConn(getState());
      const schemas = await sqlectron.db.listSchemas();
      dispatch({ type: FETCH_SCHEMAS_SUCCESS, database, schemas });
    } catch (error) {
      dispatch({ type: FETCH_SCHEMAS_FAILURE, error });
    }
  };
}
