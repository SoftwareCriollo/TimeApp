class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:url]

  CARDS_ATTRIBUTES= [:id, :name, :url, :list_id]

  ALLOWED_LIST_NAMES= [/doing/i, /to define/i, /done/i ]

  def initialize
    @organization = find_organization
  end

  def boards
    @organization.boards
  end

  ## Should return array like this
  ## [ {name:"name card", id: "id_card", list_name: "the name in", list_id: 'id'}]

  def cards_by_board(board_id)
    @board = find_board(board_id)
    lists = allowed_lists(@board.lists)
    @lists_hash = lists.inject({}) do |hash,list|
      hash[list.id]= list.name
      hash
    end
    @id_lists = @lists_hash.keys
    add_name_list_to_cards
  end

  def boards_serialized
    arrays_object(boards,BOARD_ATTRIBUTES)
  end

  def add_name_list_to_cards
    selected_cards = arrays_object(filter_cards_by_list, CARDS_ATTRIBUTES)
    selected_cards.map do |card|
      card[:list_name] = @lists_hash[card[:list_id]]
    end
    selected_cards
  end

  def filter_cards_by_list
    @board.cards.inject([]) do |result_cards, card| 
      if @id_lists.include?(card.list_id)
        result_cards << card
      else
        result_cards
      end
    end
  end


  def project_name(project_id)
    find_board(board_id).name
  end

  def task_name(task_id)
    find_card(task_id).name
  end
  
  def organization_name
    'softwarecriollo2'
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

  def find_board(board_id)
    Trello::Board.find(board_id)
  end
  def find_card(card_id)
    Trello::Card.find(card_id)
  end
  def find_organization
    Trello::Organization.find(organization_name)
  end


end