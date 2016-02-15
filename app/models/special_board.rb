class SpecialBoard
  include Mongoid::Document
  field :trello_id, type: String
  field :name, type: String
end
