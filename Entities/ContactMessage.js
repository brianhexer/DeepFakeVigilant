{
  "name": "ContactMessage",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the contact"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email address of the contact"
    },
    "subject": {
      "type": "string",
      "description": "Subject of the message"
    },
    "message": {
      "type": "string",
      "description": "Message content"
    }
  },
  "required": [
    "name",
    "email",
    "subject",
    "message"
  ],
  "rls": {
    "read": {
      "$or": [
        {
          "user_condition": {
            "role": "admin"
          }
        },
        {
          "user_condition": {
            "admin_level": "primary"
          }
        },
        {
          "user_condition": {
            "admin_level": "secondary"
          }
        }
      ]
    },
    "write": {}
  }
}