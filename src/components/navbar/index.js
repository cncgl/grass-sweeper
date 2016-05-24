import React from 'react';
// import { IndexLink, Link } from 'react-router';
import styles from './style.scss';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
} = ShareButtons;
const {
  FacebookShareCount,
  GooglePlusShareCount,
} = ShareCounts;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');

const shareUrl = 'http://cncgle.github.io/green-sweeper';
export default () => (
  <div className={styles.navbar}>
    <div className="wrapper">
      <h1>Green Sweeper</h1>
      <div className={styles.social__container}>
        <div className={styles.social__wrap}>
          <TwitterShareButton url={shareUrl} title="Green Sweeper">
            <TwitterIcon size={32} round={false} />
          </TwitterShareButton>
          <div className="myShareCountWrapper">&nbsp;</div>
        </div>
        <div className={styles.social__wrap}>
          <FacebookShareButton url={shareUrl} title="Green Sweeper" >
            <FacebookIcon size={32} round={false} />
          </FacebookShareButton>
          <FacebookShareCount url={shareUrl}>
            {shareCount => (
              <span className="myShareCountWrapper">{shareCount}</span>
            )}
          </FacebookShareCount>
        </div>
        <div className={styles.social__wrap}>
          <GooglePlusShareButton url={shareUrl}>
            <GooglePlusIcon size={32} round={false} />
          </GooglePlusShareButton>
          <GooglePlusShareCount url={shareUrl}>
            {shareCount => (
              <span className="myShareCountWrapper">{shareCount}</span>
            )}
          </GooglePlusShareCount>
        </div>
      </div>
    </div>
  </div>);
