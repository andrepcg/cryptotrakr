import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Button, StyleSheet, Text, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import Billing from 'react-native-billing';
import { find } from 'lodash';

import { GREEN, darkHeader, LIGHT_GREY } from '../styles';
import beerImage from '../assets/beer.png';
import starImage from '../assets/start.png';
import adsImage from '../assets/ads.png';

// import { products } from '../config';
import { purchaseProduct, purchaseProducts } from '../actions/purchases';
import I18n from '../translations';

import MyButton from '../components/Button';
import { Banner, buildRequest } from '../firebase';


@connect(({
  purchases: { noads, premium },
}) => ({ noads, premium }),
  { purchaseProduct, purchaseProducts },
)
export default class Premium extends PureComponent {
  static navigationOptions = {
    title: I18n.t('premium'),
    ...darkHeader,
    headerTruncatedBackTitle: null,
    headerBackTitle: null,
  };

  static propTypes = {
    purchaseProduct: PropTypes.func,
    purchaseProducts: PropTypes.func,
    noads: PropTypes.bool,
    premium: PropTypes.bool,
  }

  state = {
    loadingProducts: Platform.OS === 'android',
    productDetails: { beer: {}, premium: {}, noads: {} },
  }

  componentDidMount() {
    if (Platform.OS === 'android') this.getProductDetails();
  }

  async getProductDetails() {
    await Billing.close();
    try {
      await Billing.open();
      const details = await Billing.getProductDetailsArray(['beer', 'premium', 'noads']);
      const beer = find(details, { productId: 'beer' });
      const premium = find(details, { productId: 'premium' });
      const noads = find(details, { productId: 'noads' });
      this.setState({
        // loadingProducts: false,
        productDetails: { beer, premium, noads },
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        loadingProducts: false,
        // productDetails: { beer, premium, noads },
      });
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
        Alert.alert(I18n.t('thanksPurchase'), I18n.t('thanksDescription'));
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

  renderProductsAndroid() {
    const { premium, noads } = this.props;
    const { productDetails: { beer, premium: premiumDetails, noads: noadsDetails } } = this.state;
    if (!beer) return;
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
            title={!noads ? `${noadsDetails.priceText}${noadsDetails.currency}` : I18n.t('bought')}
            onPress={() => !noads && this.purchaseNoAds()}
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
            title={!premium ? `${premiumDetails.priceText}${premiumDetails.currency}` : I18n.t('bought')}
            onPress={() => !premium && this.purchasePremium()}
            color={premium ? GREEN : null}
          />
        </MyButton>
      </ScrollView>
    );
  }

  renderProductsIos() {
    return <Text>{I18n.t('noProducts')}</Text>;
  }

  restorePurchases = async () => {
    await Billing.close();
    try {
      await Billing.open();
      await Billing.loadOwnedPurchasesFromGoogle();
      const purchases = await Billing.listOwnedProducts();
      console.log('Purchases', purchases);
      // purchases.forEach(productId => this.props.purchaseProduct(productId));
      if (purchases && purchases.length > 0) {
        this.props.purchaseProducts(purchases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      await Billing.close();
    }
  }

  render() {
    const { loadingProducts, premium, noads } = this.state;
    return (
      <View style={styles.container}>
        {!loadingProducts && this.renderProductsAndroid()}
        <View style={styles.restore}>
          <Button
            style={styles.button}
            title={I18n.t('restorePurchases')}
            onPress={this.restorePurchases}
          />
        </View>
        {loadingProducts && this.renderLoading()}
        {!premium && !noads &&
          <Banner
            unitId="ca-app-pub-3886797449668157/4225712378"
            request={buildRequest().build()}
          />
        }
      </View>
    );
  }
}

// Icon made by Freepik from www.flaticon.com

const styles = StyleSheet.create({
  restore: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  image: {
    width: 50,
    height: 50,
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
