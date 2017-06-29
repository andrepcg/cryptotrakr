import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Button, StyleSheet, Text, Alert, ActivityIndicator, Image } from 'react-native';
import Billing from 'react-native-billing';

import { SUPER_DARKER_BLUE, darkHeader, LIGHT_GREY } from '../styles';
import beerImage from '../assets/beer.png';
import starImage from '../assets/start.png';
import adsImage from '../assets/ads.png';

import { products } from '../config';
import { purchaseProduct } from '../actions/purchases';

import MyButton from './Button';


@connect(({
  purchases: { noads, premium },
}) => ({ noads, premium }),
  { purchaseProduct },
)
export default class Premium extends PureComponent {
  static navigationOptions = {
    title: 'Premium',
    ...darkHeader,
    headerTruncatedBackTitle: null,
    headerBackTitle: null,
  };

  static propTypes = {
    purchaseProduct: PropTypes.bool,
    noads: PropTypes.bool,
    premium: PropTypes.bool,
  }

  state = {
    productsLoaded: false,
    productDetails: { beer: {}, premium: {}, noads: {} },
  }

  componentDidMount() {
    this.getProductDetails();
  }

  async getProductDetails() {
    await Billing.close();
    try {
      await Billing.open();
      // const [beer, premium, noads] = await Billing.getProductDetailsArray([products.beer, products.premium, products.noads]);
      const [beer, premium, noads] = await Billing.getProductDetailsArray(['android.test.purchased', 'android.test.purchased', 'android.test.purchased']);
      this.setState({
        productsLoaded: true,
        productDetails: { beer, premium, noads },
      });
    } catch (err) {
      console.log(err);
    } finally {
      await Billing.close();
    }
  }

  purchase = async (productId, onPurchase) => {
    let details;

    await Billing.close();
    try {
      await Billing.open();
      details = await Billing.purchase(productId);
    } catch (err) {
      console.error(err);
    } finally {
      if (details && details.purchaseState === 'PurchasedSuccessfully') {
        await Billing.consumePurchase(productId);
        Alert.alert('Thanks for your purchase!', 'Your support is very welcomed, you\'re making future development possible :)');
        if (onPurchase) onPurchase();
      }
      await Billing.close();
    }
  }

  purchaseNoAds = () => {
    this.purchase(products.noads, () => {
      this.props.purchaseProduct(products.noads);
    });
  }

  purchasePremium = () => {
    this.purchase(products.premium, () => {
      this.props.purchaseProduct(products.premium);
    });
  }

  renderLoading() {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator
          animating
          style={{ height: 80 }}
          size="large"
        />
      </View>
    );
  }

  renderProducts() {
    const { productDetails: { beer, premium, noads } } = this.state;
    return (
      <ScrollView>
        <MyButton style={styles.card} elevation={3}>
          <Image source={beerImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{beer.title}</Text>
            <Text>{beer.description}</Text>
          </View>
          <Button style={styles.button} title={`${beer.priceText}${beer.currency}`} onPress={() => this.purchase(products.beer)} />
        </MyButton>

        <MyButton style={styles.card} elevation={3}>
          <Image source={adsImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{noads.title}</Text>
            <Text>{noads.description}</Text>
          </View>
          <Button style={styles.button} title={`${noads.priceText}${noads.currency}`} onPress={() => this.purchase(products.noads)} />
        </MyButton>

        <MyButton style={styles.card} elevation={3}>
          <Image source={starImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{premium.title}</Text>
            <Text>{premium.description}</Text>
          </View>
          <Button style={styles.button} title={`${premium.priceText}${premium.currency}`} onPress={() => this.purchase(products.premium)} />
        </MyButton>
      </ScrollView>
    );
  }

  render() {
    const { productsLoaded } = this.state;
    return (
      <View style={styles.container}>
        {productsLoaded && this.renderProducts()}
        {!productsLoaded && this.renderLoading()}
      </View>
    );
  }
}

// Icon made by Freepik from www.flaticon.com

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  image: {
    width: 50,
    height: 50,
    // flex: 1,
  },
  justify: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
  },
  white: {
    color: 'white',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 2,
    alignItems: 'center',
    // justifyContent: 'space-around',
    height: 110,
  },
  description: {
    // width: 100,
    paddingLeft: 15,
    flex: 3,
  },
  button: {
    // alignContent: 'flex-end',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});
