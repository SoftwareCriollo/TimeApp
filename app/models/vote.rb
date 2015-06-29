class Vote

  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :client

  field :vote, type: String
    
end
