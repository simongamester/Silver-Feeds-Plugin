import React, {PureComponent} from 'react';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import SimpleDashboardPanel from '../../../pages/PatientsSummary/SimpleDashboardPanel';
import { rssFeedsSelector } from './rss-feeds';
import { fetchGetRssFeedsRequest } from './ducks/fetch-get-rss-feeds.duck';
import imgRSSFeeds from '../../../../assets/images/patients-summary/rss.jpg';

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ fetchGetRssFeedsRequest }, dispatch) });

@connect(rssFeedsSelector, mapDispatchToProps)
export default class RssDashboardPanel extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    rssFeedName: PropTypes.string.isRequired,
    rssFeedUrl: PropTypes.string.isRequired,
  };

  state = {
    indexItemForPreview: 0,
  };

  componentDidMount() {
    const { rssFeeds, rssFeedUrl, rssFeedName, actions } = this.props;
    if (rssFeedName && !rssFeeds[rssFeedName]) {
      actions['fetchGetRssFeedsRequest']({ rssFeedName, rssFeedUrl })
    }
    // const indexItemForPreview = getRandomInt(0, 3);
    // this.setState({indexItemForPreview});
  }

  getRssItems = rssFeeds => {
    const { rssFeedName } = this.props;
    const rssList = rssFeeds[rssFeedName];
    if (!rssList) {
      return [{ text: 'Loading...' }, '', '', ''];
    }
    return _.flow(
      arr => _.concat(arr, ['', '', '', '']),
        _.take(4),
        _.map(el => ({
          text: el.title,
          link: el.link,
          thumbnail: el.thumbnail,
        }))
      )(rssList);
  };

  render() {
    const { rssFeeds, title, state, goToState, isHasPreview, isHasList, rssFeedName } = this.props;
    const { indexItemForPreview } = this.state;
    const items = this.getRssItems(rssFeeds);
    let srcPrevirew;
    if (!rssFeeds[rssFeedName]) {
      srcPrevirew = imgRSSFeeds;
    } else {
      srcPrevirew = items[indexItemForPreview].thumbnail ? items[indexItemForPreview].thumbnail : imgRSSFeeds;
    }
    return (
      <SimpleDashboardPanel
         title={title}
         state={state}
         goToState={goToState}
         isHasPreview={isHasPreview}
         isHasList={isHasList}
         items={items}
         srcPrevirew={srcPrevirew}
         isFeeds={true}
      />
    )
  }
}