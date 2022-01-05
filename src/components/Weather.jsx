import React, { Component } from "react";
import weatherApi from "./../services/weatherService";
// import data from "../services/dataService";
import Loading from "./common/Loading";

class Weather extends Component {
  state = {
    bigData: {},
    loading: false,
    searchLoading: false,
    searchQuery: "",
    cityList: [],
    currentCity: {
      woeid: 2490383,
    },
    currentDay: {},
    nextDays: [],
    isData: null,
    filtered: [],
  };

  async getCityInfo(id) {
    this.setState({ loading: true });
    try {
      this.setState({ searchQuery: "" });
      const { data } = await weatherApi.getByLocation(id);
      const [f, ...r] = data.consolidated_weather;
      this.setState({ bigData: data });
      this.setState({ currentDay: f, nextDays: r });
    } catch (err) {}
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.getCityInfo(this.state.currentCity.woeid);
  }

  handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      this.setState({ searchQuery: e.target.value });
      this.setState({ searchLoading: true });
      const city = await weatherApi.searchLocation(this.state.searchQuery);
      this.setState({ cityList: city.data });
      this.setState({ isData: city.data.length === 0 ? true : false });
      this.setState({ searchLoading: false });
    }
  };

  handleSearch = async () => {
    this.setState({ searchLoading: true });
    const city = await weatherApi.searchLocation(this.state.searchQuery);
    this.setState({
      filtered: city.data.filter((d) => d.woeid !== this.state.bigData.woeid),
    });
    this.setState({ cityList: city.data });
    this.setState({ isData: city.data.length === 0 ? true : false });
    this.setState({ searchLoading: false });
  };

  render() {
    const {
      isData,
      searchLoading,
      searchQuery,
      cityList,
      bigData,
      currentDay,
      nextDays,
      loading,
      filtered,
    } = this.state;

    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const today = new Date(currentDay.applicable_date).toLocaleDateString(
      "en-US",
      options
    );

    return loading ? (
      <Loading />
    ) : (
      <div className="row ">
        <div className="col-sm-4 left">
          <div className="c-center inpt">
            <input
              onKeyDown={(e) => this.handleKeyDown(e)}
              className="form-control m-2"
              type="text"
              placeholder="Search..."
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
            />
            <button
              disabled={searchQuery === ""}
              className="btn btn-primary w-5 m-2"
              onClick={this.handleSearch}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="c-center inpt">
            {cityList.length === 0 ? (
              isData === true ? (
                <p className="h6">Not found</p>
              ) : null
            ) : (
              <select
                className="form-select"
                onChange={(e) => {
                  this.getCityInfo(e.target.value);
                }}
              >
                <option value="" style={{ display: "none" }} disabled selected>
                  {bigData.title}
                </option>
                {filtered.map((city) => (
                  <option key={city.woeid} value={city.woeid}>
                    {city.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="c-center">
            <img
              className="weather-day-img"
              src={weatherApi.imgUrl(currentDay.weather_state_abbr)}
              alt="img"
            />
          </div>
          <div className="c-center h1 inpt">
            {Math.round(currentDay.the_temp)} °C
          </div>
          <div className="c-center h3 inpt">
            {currentDay.weather_state_name}
          </div>
          <div className="c-center mt-4 inpt h4">Today • {today}</div>
          <div className="c-center inpt ">
            <div className="h1 inpt mt-5">{bigData.title}</div>
          </div>
        </div>
        <div className="col-sm-8 right">
          <div className="inpt">
            <div className="row c-center m-2">
              {nextDays.map((day) => (
                <div className="c-center cards col-sm-2" key={day.id}>
                  <h6>
                    {new Date(day.applicable_date).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </h6>
                  <img
                    src={weatherApi.imgUrl(day.weather_state_abbr)}
                    style={{ width: "5em" }}
                    alt="img"
                  />
                  <div className="h6 mt-2">{day.weather_state_name}</div>
                  <div className="h6 mt-4">{`${Math.round(
                    day.min_temp
                  )}°C • ${Math.round(day.max_temp)}°C`}</div>
                </div>
              ))}

              <div className="m-3 inpt">
                <div className="h4 mt-5 m-4 inpt">Today's highlights</div>
                <div className="inpt m-4">
                  <div className="row c-center">
                    <div className="col-sm m-2 inpt c-center cards">
                      <h4>Wind Status</h4>
                      <h1>{Math.round(currentDay.wind_speed)} mph</h1>
                    </div>
                    <div className="col-sm inpt m-2 c-center cards">
                      <h4>Humidity</h4>
                      <h1>{currentDay.humidity}%</h1>
                    </div>
                  </div>
                  <div className="row c-center">
                    <div className="col-sm inpt m-2 c-center cards">
                      <h4>Visibility</h4>
                      <h1>
                        {parseFloat(currentDay.visibility).toFixed(2)} miles
                      </h1>
                    </div>
                    <div className="col-sm inpt m-2 c-center cards">
                      <h4>Air Pressure</h4>
                      <h1>{currentDay.air_pressure} mb</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Weather;
