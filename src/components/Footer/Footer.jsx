import React from "react";
import "./Footer.css";
import logo from "../../../public/Logo.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Vision */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="PMIS Logo" className="logo-icon1" />
            <span className="footer-brand">PMIS</span>
          </div>
          <p className="footer-text">
            Our vision is to provide convenience and help increase your sales business.
          </p>
          {/* Social Icons */}
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">About</h3>
          <ul className="footer-list">
            <li><a href="#">How it works</a></li>
            <li><a href="#">Featured</a></li>
            <li><a href="#">Partnership</a></li>
            <li><a href="#">Business Relation</a></li>
          </ul>
        </div>

        {/* Community Section */}
        <div className="footer-section">
          <h3 className="footer-title">Community</h3>
          <ul className="footer-list">
            <li><a href="#">Events</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Podcast</a></li>
            <li><a href="#">Invite a friend</a></li>
          </ul>
        </div>

        {/* Socials Section */}
        <div className="footer-section">
          <h3 className="footer-title">Socials</h3>
          <ul className="footer-list">
            <li><a href="#">Discord</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>©2025 Company Name. All rights reserved</p>
        <div className="footer-links">
          <a href="#">Privacy & Policy</a>
          <a href="#">Terms & Condition</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
