class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:url]

  CARDS_ATTRIBUTES= [:id, :name, :url]

  def initialize
    @organization = Trello::Organization.find(organization_name)
  end

  def boards
    @organization.boards
  end

  def cards_by_board(board_id)
    board = Trello::Board.find(board_id)
    board.cards
  end


  def boards_serialized
    arrays_object(boards,BOARD_ATTRIBUTES)
  end

  def cards_serialized(board_id)
    cards = cards_by_board(board_id)
    arrays_object(cards,CARDS_ATTRIBUTES)
  end

  def organization_name
    'softwarecriollo'
  end

end