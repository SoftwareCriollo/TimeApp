class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:url]

  CARDS_ATTRIBUTES= [:id, :name, :url]

  ALLOWED_LIST_NAMES= [/doing/i, /to define/i, /done/i ]

  def initialize
    @organization = Trello::Organization.find(organization_name)
  end

  def boards
    @organization.boards
  end

  def cards_by_board(board_id)
    board = Trello::Board.find(board_id)
    lists = allowed_lists(board.lists)
    get_cards(lists)
  end

  def boards_serialized
    arrays_object(boards,BOARD_ATTRIBUTES)
  end

  def cards_serialized(board_id)
    cards = []
      cards_by_board(board_id)

    arrays_object(cards,CARDS_ATTRIBUTES)
  end

  def organization_name
    'softwarecriollo'
  end

  def allowed_lists(lists)
    lists.select{|list| allowed_list?(list) } 
  end

  def allowed_list?(list)
    ALLOWED_LIST_NAMES.any?{|name| name.match(list.name) }     
  end

  def get_cards(lists)
    lists.inject({}) do |value, list|
      value[list.name] = list.cards
      value
    end

  end


end