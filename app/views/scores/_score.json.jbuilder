json.extract! score, :id, :user, :tries, :seconds, :num_pos, :repeated, :created_at, :updated_at
json.url score_url(score, format: :json)