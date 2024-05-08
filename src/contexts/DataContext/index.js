import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null)
  const getData = useCallback(async () => {
    try {
      const azerty = await api.loadData()
      setData(azerty);

      const qwerty = azerty.events.sort((evtA, evtB) => new Date(evtA.date) - new Date(evtB.date))
      setLast(qwerty[0])
      console.log(qwerty)

    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        last,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
