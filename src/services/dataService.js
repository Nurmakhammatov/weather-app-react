import weatherApi from "./weatherService";
// let dataValues = null;
try {
  const dataService = async () => {
    const data = await weatherApi.getByLocation(2344116);
    // dataValues = data;
    return data;
    //   const [f, ...r] = data.consolidated_weather;
    //   return f, r;
  };
} catch (error) {
  console.error(error);
}

export default ;
