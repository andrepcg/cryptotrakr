import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Button, StyleSheet, Text, Alert, ActivityIndicator, Image } from 'react-native';
import Billing from 'react-native-billing';

import { GREEN, darkHeader, LIGHT_GREY } from '../styles';
import beerImage from '../assets/beer.png';
import starImage from '../assets/start.png';
import adsImage from '../assets/ads.png';

import { products } from '../config';
import { purchaseProduct } from '../actions/purchases';

import MyButton from '../components/Button';


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
    purchaseProduct: PropTypes.func,
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
      const [beer, premium, noads] = await Billing.getProductDetailsArray(['beer', 'premium', 'noads']);
      // const [beer, premium, noads] = await Billing.getProductDetailsArray(['android.test.purchased', 'android.test.purchased', 'android.test.purchased']);
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

  purchase = async (productId, onPurchase, consume = true) => {
    let details;

    await Billing.close();
    try {
      await Billing.open();
      details = await Billing.purchase(productId);
    } catch (err) {
      console.error(err);
    } finally {
      if (details && details.purchaseState === 'PurchasedSuccessfully') {
        if (consume) await Billing.consumePurchase(productId);
        Alert.alert('Thanks for your purchase!', 'Your support is very welcomed, you\'re making future development possible :)');
        if (onPurchase) onPurchase();
      }
      await Billing.close();
    }
  }

  purchaseNoAds = () => {
    this.purchase('noads', () => {
      this.props.purchaseProduct('noads');
    });
  }

  purchasePremium = () => {
    this.purchase('premium', () => {
      this.props.purchaseProduct('premium');
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
    const { premium, noads } = this.props;
    const { productDetails: { beer, premium: premiumDetails, noads: noadsDetails } } = this.state;
    return (
      <ScrollView>
        <MyButton style={styles.card} elevation={3}>
          <Image source={beerImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{beer.title}</Text>
            <Text>{beer.description}</Text>
          </View>
          <Button
            style={styles.button}
            title={`${beer.priceText}${beer.currency}`}
            onPress={() => this.purchase('beer', () => {}, true)}
          />
        </MyButton>

        <MyButton style={styles.card} elevation={3}>
          <Image source={adsImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{noadsDetails.title}</Text>
            <Text>{noadsDetails.description}</Text>
          </View>
          <Button
            style={styles.button}
            title={!noads ? `${noadsDetails.priceText}${noadsDetails.currency}` : 'Bought'}
            onPress={() => !noads && this.purchase('noads')}
            color={noads ? GREEN : null}
          />
        </MyButton>

        <MyButton style={styles.card} elevation={3}>
          <Image source={starImage} style={styles.image} />
          <View style={styles.description}>
            <Text style={styles.title}>{premiumDetails.title}</Text>
            <Text>{premiumDetails.description}</Text>
          </View>
          <Button
            style={styles.button}
            title={`${premiumDetails.priceText}${premiumDetails.currency}`}
            onPress={() => !premium && this.purchase('premium')}
            color={premium ? GREEN : ''}
          />
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
