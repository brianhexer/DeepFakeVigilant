{
  "name": "AppStats",
  "type": "object",
  "properties": {
    "total_analyses": {
      "type": "number",
      "default": 0,
      "description": "Total number of videos analyzed across the entire application"
    },
    "singleton": {
      "type": "boolean",
      "default": true,
      "unique": true,
      "description": "Ensures only one stats document exists"
    }
  },
  "required": [
    "total_analyses"
  ],
  "rls": {
    "read": {},
    "write": {
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
        }
      ]
    }
  }
}