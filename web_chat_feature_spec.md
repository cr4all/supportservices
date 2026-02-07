# Web Chat Feature Specification
(Visitor Web Chat + Admin Reply)

## 1. Purpose

This web chat feature provides a secure, official way for visitors
(from Reddit or other external sources) to send messages directly
through the website and receive replies from the administrator.

The chat is intended for:
- Initial contact
- Support questions
- Trust-building before moving to the app

It is not intended to replace full in-app messaging.

---

## 2. Core Requirements

### Visitor Side
- No account or login required
- Anonymous or temporary session
- Ability to send and receive messages in real time
- Mobile-friendly UI

### Admin Side
- View incoming chat sessions
- Read messages in real time
- Reply directly to visitors
- Close or ignore sessions if needed

---

## 3. High-Level Architecture

Visitor Browser
   ↕ (Realtime)
Web Chat UI
   ↕
Backend (DB + Realtime)
   ↕
Admin Chat Dashboard

Database: MongoDB

---

## 5. Visitor Chat Flow

1. Visitor opens the contact page
2. Visitor clicks “Message Me”
3. Chat session is created or resumed
4. when visitor sends a first message, page requires visitor's name or email but it is optional.
5. Visitor sends a message
6. Admin replies in real time

---

## 6. Visitor Chat UI

### Entry Button
Message Me Here

### Chat Copy
Secure Web Chat

This chat is for official contact and support.
Please do not share sensitive information.

---

## 7. Admin Dashboard

Core features:
- Active session list
- Unread message indicator
- Chat view per session
- Reply input
- Session close action

Admin access is restricted.

---

## 8. Real-Time Messaging

- Realtime subscriptions per session
- Instant message delivery
- Reconnect handling

---

## 9. Non-Goals

- User accounts
- File uploads
- Voice/video
- Notifications
- Public chat rooms

---

## 11. Summary

A lightweight anonymous web chat that allows visitors to message
through the official website and receive real-time admin replies,
designed for Reddit-friendly contact and support.
