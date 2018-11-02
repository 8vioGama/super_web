import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';

// AB Testing
import Experiment from 'react-ab-test/lib/Experiment';
import Variant from 'react-ab-test/lib/Variant';
import emitter from 'react-ab-test/lib/emitter';
import mixpanelHelper from 'react-ab-test/lib/helpers/mixpanel';

import Layout from '../../common/Layout/Layout';
import './home.scss';

//  Images
import howImg from '../../../assets/images/preview.png';
import priceImg from '../../../assets/images/driver.png';
import poweredByGoogleImg from '../../../assets/images/powered_by_google_on_white.png';
import testimonialAuthor from '../../../assets/images/testimonial.png';

import Button from '../../common/Button/Button';
import Testimonial from '../../common/Testimonial/Testimonial';


const testimonialstop = [
  { image: testimonialAuthor, description: "Excelente servicio, todo muy practico y rapido", name: "Luis Arias, CDMX, Mexico"},
  { image: testimonialAuthor, description: "Excelente servicio, todo muy practico y rapido", name: "Luis Arias, CDMX, Mexico"},
  { image: testimonialAuthor, description: "Excelente servicio, todo muy practico y rapido", name: "Luis Arias, CDMX, Mexico"},
];

const testimonialsbottom = [
  { image: testimonialAuthor, description: "Excelente servicio, todo muy practico y rapido", name: "Luis Arias, CDMX, Mexico"},
  { image: testimonialAuthor, description: "SuperFletes son los mejores en envios internacionales", name: "Rafael Suarez, Caracas, Venezuela"},
  { image: testimonialAuthor, description: "Mi mudanza fue hecha de manera fluida y el pago fue facil", name: "Lorena Garcia, CDMX, Mexico"},
];

const images = require.context('../../../assets/images/', true);

mixpanelHelper.enable();

const { mixpanel } = window;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '',
      destination: '',
      date: moment(),
      name: '',
      email: '',
      phone: '',
      vehicleType: '',
      vehicleTypeOpen: false,
      loading: false,
      step: 1,
      requested: false,
      created: false,
    };

    this.node = React.createRef();

    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentDidMount() {
    this.props.requestVehicleTypes();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  requestQuote = (response, status) => {

    if (status === 'OK') {
      const distance = response.rows[0].elements[0].distance.value;
      this.props.setDistance(distance);

      const requestData = {
        origin: this.props.origin,
        destination: this.props.destination,
        distance: this.props.distance,
        vehicleType: String(this.props.vehicleType.id),
      };
      this.props.requestQuote(requestData)
        .then((result) => {
          mixpanel.track(
            'New Quote',
            {
              vehiculo: this.props.vehicleType.name,
              origen: this.props.origin.address,
              destino: this.props.destination.address,
              distance: this.props.distance,
              precio: result,
              tel: this.state.phone ? this.state.phone : '',
            },
          );
          setTimeout(() =>{ 
            this.setState({ loading: false });
          }, 1000);
        });
    }
  }

  calculateDistance = () => {
    const { google } = window;
    const { origin, destination } = this.props;
    const originCoords = new google.maps.LatLng(origin.latLng.lat, origin.latLng.lng);
    const destinationCoords = new google.maps.LatLng(destination.latLng.lat, destination.latLng.lng);

    this.setState({ loading: true });

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [originCoords],
      destinations: [destinationCoords],
      travelMode: 'DRIVING',
    }, this.requestQuote);
  }

  handleOriginSelect = (address) => {
    this.setState({ origin: address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.props.setOrigin({
        address,
        latLng,
      }))
      .then(() => {
        const phoneElement = document.getElementById('phoneNumber');

        if (phoneElement && phoneElement.length > 0) {
          if (this.props.destination.latLng && this.state.phone) {
            this.calculateDistance();
          }
        } else {
          if (this.props.destination.latLng) {
            this.calculateDistance();
          }
        }
      })
      .catch(error => console.error('Error', error));
  };

  handleDestinationSelect = (address) => {
    this.setState({ destination: address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.props.setDestination({
        address,
        latLng,
      }))
      .then(() => {
        const phoneElement = document.getElementById('phoneNumber');

        if (phoneElement && phoneElement.length > 0) {
          if (this.props.origin.latLng && this.state.phone) {
            this.calculateDistance();
          }
        } else {
          if (this.props.origin.latLng) {
            this.calculateDistance();
          }
        }
      })
      .catch(error => console.error('Error', error));
  };

  handleOriginChange = origin => this.setState({ origin });
  handleDestinationChange = destination => this.setState({ destination });
  handleEmailChange = email => this.setState({ email: email.target.value });
  handleDateChange = date => this.setState({ date });
  handleNameChange = name => this.setState({ name: name.target.value });

  handlePhoneChange = (phone) => {
    this.setState({ phone: phone.target.value });
    if (this.state.phone.length > 0
      && this.state.step === 1
      && this.props.origin.latLng
      && this.props.destination.latLng) {
      this.calculateDistance();
    }
  };

  handleVehicleTypeChange = (vehicleType) => {
    this.setState({ vehicleType: vehicleType.name });
    this.props.setVehicleType(vehicleType);
    this.setState({ vehicleTypeOpen: false });

    const phoneElement = document.getElementById('phoneNumber');

    if (phoneElement && phoneElement.length > 0) {
      if (this.props.origin.latLng && this.props.destination.latLng && this.state.phone) {
        this.calculateDistance();
      }
    } else {
      if (this.props.origin.latLng && this.props.destination.latLng) {
        this.calculateDistance();
      }
    }
  };

  openVehicleDropdown = () => {
    this.setState({ vehicleTypeOpen: true });
  };

  handleClickOutside = (e) => {
    if (this.node.current.contains(e.target)) {
      return;
    };

    this.setState({ vehicleTypeOpen: false });
  };

  submitRequestQuote = (e) => {
    e.preventDefault();
    this.setState({ step: 2 });
    mixpanel.track(
      'Interested in booking',
      {
        vehiculo: this.props.vehicleType.name,
        origen: this.props.origin.address,
        destino: this.props.destination.address,
        distance: this.props.distance,
        precio: this.props.quote,
        tel: this.state.phone ? this.state.phone : '',
      },
    );
  }

  goBack = () => {
    this.setState({ step: 1 });
  }

  submitRequestService = (e) => {
    e.preventDefault();

    const requestData = {
      origin: this.props.origin,
      destination: this.props.destination,
      distance: this.props.distance,
      vehicleType: this.props.vehicleType.id,
      totalPrice: this.props.quote,
      startDate: this.state.date,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
    };

    this.setState({ loading: true });
    this.props.requestService(requestData)
      .then(() => {
        
        mixpanel.track(
          'New reservation',
          {
            origin: this.props.origin.address,
            destination: this.props.destination.address,
            distance: this.props.distance,
            vehicleType: this.props.vehicleType.id,
            totalPrice: this.props.quote,
            startDate: this.state.date,
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone ? this.state.phone : '',
          },
        );

        this.setState({ requested: true });

        setTimeout(() => {
          this.setState({ created: true });
        }, 500);
        swal("Tu reserva esta en proceso", "Hemos recibido tu solicitud y estaremos en contacto pronto", "success");
      })
  }

  render() {
    const { vehicleTypes, quote } = this.props;
    const { loading, step, date, requested, created } = this.state;

    return (
      <Layout>
        <div className="section section--hero">
          <div className="wrapper">
            <div className="hero__content">
              <h1 className="title title--lg text--centered">Transporta lo que necesites cuando lo necesites</h1>
              {!created &&
                <div className={`form form--booking ${requested ? 'hidden' : '' }`}>
                <Experiment ref="experiment" name="My Example">
                  <Variant name="A">
                    <form onSubmit={ this.submitRequestQuote } className={`step step--1 ${step === 1 ? 'visible' : 'hidden'}`}>
                      <div className="d-flex">
                        <div id="phoneNumber" className="input-group col-one-fifth">
                          <label htmlFor="">Número telefónico</label>
                          <input type="phone" onChange={this.handlePhoneChange} value={this.state.phone} required/>
                        </div>
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">vehiculo</label>
                          <input type="text" name="" id="" placeholder="Selecciona" value={this.state.vehicleType} onClick={this.openVehicleDropdown} required/>
                          <div className="autocomplete-dropdown-container dropdown--vehicles" ref={this.node}>
                            {this.state.vehicleTypeOpen && vehicleTypes.map((vehicleType) => {
                              return (
                                <div className="suggestion-item" onClick={() => this.handleVehicleTypeChange(vehicleType)} id={vehicleType.id}>
                                  <span><img src={images(`./vehicle-${vehicleType.id}.png`)} />{ vehicleType.name }</span>
                              </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="input-group col-three-tenths">
                          <label htmlFor="">Origen</label>
                          <PlacesAutocomplete
                            value={this.state.origin}
                            onChange={this.handleOriginChange}
                            onSelect={this.handleOriginSelect}
                          >
                            {({
                              getInputProps, suggestions, getSuggestionItemProps, loading,
                            }) => (
                              <div className="input--address">
                                <span className="icon icon--marker" />
                                <input
                                  {...getInputProps({
                                    placeholder: 'Selecciona el origen ...',
                                    className: 'location-search-input',
                                  })}
                                  required
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                  {suggestions.length > 0 &&
                                    <img src={poweredByGoogleImg} className="poweredBygoogle" alt="" />
                                  }
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                        <div className="input-group col-three-tenths">
                          <label htmlFor="">destino</label>
                          <PlacesAutocomplete
                            value={this.state.destination}
                            onChange={this.handleDestinationChange}
                            onSelect={this.handleDestinationSelect}
                          >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                              <div className="input--address">
                                <span className="icon icon--marker"></span>
                                <input
                                  {...getInputProps({
                                    placeholder: 'Selecciona el destino ...',
                                    className: 'location-search-input',
                                  })}
                                  required
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                  {suggestions.length > 0 &&
                                    <img src={poweredByGoogleImg} className="poweredBygoogle" alt=""/>
                                  }
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                      </div>
                      <div className="d-flex justify__between top-2">
                        <div className="input-group col-one-half">
                          <p>*Precios solo incluyen transporte. Servicios adicionales como maniobra, horas de espera y volado se cotizaran en reserva.</p>
                        </div>
                        <div className="input-group align-right button-group">
                          <button name="" id="">
                            {(!loading && quote.length > 0) &&
                              <span>{`Reserva por $${quote} M.N`}</span>
                            }
                            {(!loading && quote.length === 0) &&
                              <span>Cotizar</span> 
                            }
                            {loading &&
                              <div className="lds-css">
                                <div className="lds-rolling">
                                  <div />
                                </div>
                              </div>
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                    <form onSubmit={ this.submitRequestService } className={`step step--2 ${step === 2 ? 'visible' : 'hidden'}`}>
                      <div className="d-flex">
                        <div className="input-group col-one-fourth">
                          <label htmlFor="">Nombre</label>
                          <input type="text" onChange={this.handleNameChange} value={this.state.name} required/>
                        </div>
                        <div className="input-group col-one-fourth">
                          <label htmlFor="">Email</label>
                          <input type="text" onChange={this.handleEmailChange} value={this.state.email} required/>
                        </div>
                        <div className="input-group col-one-fourth">
                          <label htmlFor="">Fecha de recolección</label>
                          <div className="">
                            <DatePicker
                              selected={date}
                              selectsStart
                              startDate={date}
                              onChange={this.handleDateChange}
                              placeholderText="Selecciona una fecha"
                              dateFormat="DD/MMM/YYYY"
                            />
                          </div>
                        </div>
                        <div className="input-group col-one-fourth">
                          <label htmlFor="">Servicios adicionales</label>
                          <input type="date" onChange={this.handleDateChange} value={this.state.date} required/>
                        </div>
                      </div>
                      <div className="d-flex justify__between top-2">
                        <div className="input-group align-left button-group">
                          <div name="" className="btn btn--blue" id="" onClick={this.goBack}><span>Atrás</span></div>
                        </div>
                        <div className="input-group col-one-half">
                          <p>*Precios solo incluyen transporte. Servicios adicionales como maniobra, horas de espera y volado se cotizaran en reserva.</p>
                        </div>
                        <div className="input-group align-right button-group">
                          <button name="" id="">
                            {loading &&
                              <div className="lds-css">
                                <div className="lds-rolling">
                                  <div />
                                </div>
                              </div>
                            }
                            {!loading &&
                              <span>{`Reserva por $${quote} M.N`}</span>
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                  </Variant>
                  <Variant name="B">
                    <form onSubmit={ this.submitRequestQuote } className={`step step--1 ${step === 1 ? 'visible' : 'hidden'}`}>
                      <div className="d-flex">
                        <div className="input-group col-one-fourth">
                          <label htmlFor="">vehiculo</label>
                          <input type="text" name="" id="" placeholder="Selecciona" value={this.state.vehicleType} onClick={this.openVehicleDropdown} required/>
                          <div className="autocomplete-dropdown-container dropdown--vehicles" ref={this.node}>
                            {this.state.vehicleTypeOpen && vehicleTypes.map((vehicleType) => {
                              return (
                                <div className="suggestion-item" onClick={() => this.handleVehicleTypeChange(vehicleType)} id={vehicleType.id}>
                                  <span><img src={images(`./vehicle-${vehicleType.id}.png`)} />{ vehicleType.name }</span>
                              </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="input-group col-three-eights">
                          <label htmlFor="">Origen</label>
                          <PlacesAutocomplete
                            value={this.state.origin}
                            onChange={this.handleOriginChange}
                            onSelect={this.handleOriginSelect}
                          >
                            {({
                              getInputProps, suggestions, getSuggestionItemProps, loading,
                            }) => (
                              <div className="input--address">
                                <span className="icon icon--marker" />
                                <input
                                  {...getInputProps({
                                    placeholder: 'Selecciona el origen ...',
                                    className: 'location-search-input',
                                  })}
                                  required
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                  {suggestions.length > 0 &&
                                    <img src={poweredByGoogleImg} className="poweredBygoogle" alt="" />
                                  }
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                        <div className="input-group col-three-eights">
                          <label htmlFor="">destino</label>
                          <PlacesAutocomplete
                            value={this.state.destination}
                            onChange={this.handleDestinationChange}
                            onSelect={this.handleDestinationSelect}
                          >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                              <div className="input--address">
                                <span className="icon icon--marker"></span>
                                <input
                                  {...getInputProps({
                                    placeholder: 'Selecciona el destino ...',
                                    className: 'location-search-input',
                                  })}
                                  required
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                      ? 'suggestion-item--active'
                                      : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                  {suggestions.length > 0 &&
                                    <img src={poweredByGoogleImg} className="poweredBygoogle" alt=""/>
                                  }
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                      </div>
                    <div className="d-flex justify__between top-2">
                        <div className="input-group col-one-half">
                          <p>*Precios solo incluyen transporte. Servicios adicionales como maniobra, horas de espera y volado se cotizaran en reserva.</p>
                        </div>
                        <div className="input-group align-right button-group">
                          <button name="" id="" type="submit">
                            {(!loading && quote.length > 0) &&
                              <span>{`Reserva por $${quote} M.N`}</span>
                            }
                            {(!loading && quote.length === 0) &&
                              <span>Cotizar</span> 
                            }
                            {loading &&
                              <div className="lds-css">
                                <div className="lds-rolling">
                                  <div />
                                </div>
                              </div>
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                    <form onSubmit={ this.submitRequestService } className={`step step--2 ${step === 2 ? 'visible' : 'hidden'}`}>
                      <div className="d-flex">
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">Nombre</label>
                          <input type="text" onChange={this.handleNameChange} value={this.state.name} required/>
                        </div>
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">Email</label>
                          <input type="text" onChange={this.handleEmailChange} value={this.state.email} required/>
                        </div>
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">Teléfono</label>
                          <input type="text" onChange={this.handlePhoneChange} value={this.state.phone} required/>
                        </div>
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">Detalles de la carga</label>
                          <input type="text" onChange={this.handleCargoChange} value={this.state.cargo} required/>
                        </div>
                        <div className="input-group col-one-fifth">
                          <label htmlFor="">Fecha de recolección</label>
                          <DatePicker
                              selected={date}
                              selectsStart
                              startDate={date}
                              onChange={this.handleDateChange}
                              placeholderText="Selecciona una fecha"
                              dateFormat="DD/MMM/YYYY"
                            />                        
                          </div>
                      </div>
                      <div className="d-flex justify__between top-2">
                        <div className="input-group align-left button-group">
                          <div name="" className="btn btn--blue" id="" onClick={this.goBack}><span>Atrás</span></div>
                        </div>
                        <div className="input-group col-one-half">
                          <p>*Precios solo incluyen transporte. Servicios adicionales como maniobra, horas de espera y volado se cotizaran en reserva.</p>
                        </div>
                        <div className="input-group align-right button-group">
                          <button name="" id="">
                          {loading &&
                              <div className="lds-css">
                                <div className="lds-rolling">
                                  <div />
                                </div>
                              </div>
                            }
                            {!loading &&
                              <span>{`Reserva por $${quote} M.N`}</span>
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                  </Variant>
                </Experiment>
              </div>
              }
              {created &&
              <div className="button-group button-group--centered">
                <button onCLick={back}>Cotiza de nuevo</button>
              </div>
              }
            </div>
          </div>
        </div>
        <div className="section section--how bg-grey__alt color--black-text">
          <h2 className="title text-md color--black-text text--centered">¿Cómo funciona?</h2>
          <div className="wrapper">
            <div className="row">
            <div className="col-6 row align-center">
              <div className="img-container img--lg">
                <img className="img" src={howImg} />
              </div>
            </div>
            <div className="col-6 row align-center">
              <div className="col-12 box--how text-sm">
                <div className="box--how__overlay z-front" onMouseOver={this.handleHover} id="box-0">

                </div>
                <div className="box--how__content z-back row">
                  <div className="box--how__number col-2">
                    <p className='text-lg'>
                      1
                    </p>
                  </div>
                  <div className="box--how__text col-10">
                    <p className="color--blue">
                      Cotiza tu flete
                    </p>
                    <p className="no-margin">
                      Dinos lo que quieres mover y nostros te proporcionamos el flete ideal para ti.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 box--how text-sm">
                <div className="box--how__overlay z-front" onMouseOver={this.handleHover} id="box-1">

                </div>
                <div className="box--how__content z-back row">
                  <div className="box--how__number col-2">
                    <p className='text-lg'>
                      2
                    </p>
                  </div>
                  <div className="box--how__text col-10">
                    <p className="color--blue">
                      Reserva fácilmente
                    </p>
                    <p className="no-margin">
                      Una vez que estás satisfecho con tu recomencdación, reservalo sin problemas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 box--how text-sm">
                <div className="box--how__overlay z-front" onMouseOver={this.handleHover} id="box-2">

                </div>
                <div className="box--how__content z-back row">
                  <div className="box--how__number col-2">
                    <p className='text-lg'>
                      3
                    </p>
                  </div>
                  <div className="box--how__text col-10">
                    <p className="color--blue">
                      Transporta tu carga
                    </p>
                    <p className="no-margin">
                      Te mantenemos informado en todos momento del estatus de tu servicio
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="section--price bg-white color--black-text">
          <div className='row'>
            <div className="col-6 price__left d-flex">
              <div className='bg-grey__alt d-flex'>
                <div className="price__left__content ma-auto">
                  <h2 className="title text-md color--black-text no-margin">Transportistas certificados</h2>
                  <p className="no-margin text-sm">
                    Auditamos a todos nuestros transportistas. Basados en CDMX con alcance nacional. Paga en efectivo, deposito o transferencia. Aseguraremos tu mercancía.
                  </p>
                  <Button
                    class="btn--blue text-sm top-1"
                    string="Cotiza tu superflete"
                  />
                </div>
              </div>
            </div>
            <div className="col-6 price__right">
              <div className='price--image'>
                <img src={priceImg} alt="driver"/>
              </div>
            </div>
          </div>                     
        </div>
        <div className="section--testimonials bg-white color--black-text">
          <div className="row wrapper">
            <div>
              <h2 className="title text-md no-margin text--centered">Nuestros clientes</h2>
              <div className="row">
                {
                  testimonialsbottom.map((testimonial, i) => {
                    return (
                      <Testimonial
                        image={testimonial.image}
                        description={testimonial.description}
                        name={testimonial.name}
                        key={ i }
                      />
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

Home.propTypes = {

};

export default Home;
