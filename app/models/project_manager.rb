require 'json'
require 'yaml'

class ProjectManager
  include Serializer

  BOARD_ATTRIBUTES= [:id,:name,:url]

  CARDS_ATTRIBUTES= [:id, :name, :url, :list_id, :due]

  ALLOWED_LIST_NAMES= [/doing/i, /to define/i, /done/i, /to do/i ]

  def initialize
    @organization = find_organization
    #@espcial_board_ids = ["5427061ed62e617fa949b9fb"] #[Opensublet]
    @espcial_board_ids = [] #[Opensublet]
  end

  def especial_boards
   @espcial_board_ids.map{|bid| Trello::Board.find(bid)}
  end

  def boards
    @organization.boards.select{|board| !board.closed?}.concat(especial_boards)
  end

  def find_member(member_id)
    Trello::Member.find(member_id).username
  end

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

  def cards_by_board_due(board_id)
    CardsByWeek.new(cards_by_board(board_id)).process
  end

  def all_cards
    c1 = []
    cards = boards.map(&:cards)
    all_boards = {}
    boards.each do |b|
      all_boards[b.id] = b.name
    end

    all_members = {}
    @organization.members.each do |m|
      all_members[m.id] = m.username
    end

    puts all_members

    cards.each do |card|
     # c2 = card.map(&:attributes)

      c2 = card.map { |c| {
          id: c.id,
          name: c.name,
          due: c.due,
          url: c.url,
          board_id: c.board_id,
          board_name: all_boards[c.board_id],
          member_ids: c.member_ids #member_ids.map { |m| all_members[m] }
        }
      }
      c1 += c2
    end
    CardsByWeek.new(c1).process
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
    find_board(project_id).name
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
    #ALLOWED_LIST_NAMES.any?{|name| name.match(list.name) }
    true
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
