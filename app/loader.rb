class Loader

  DEGREES = ["BS CS/Mathematics", "BS Video Game Studies", "BA Bourbon Appreciation", "BS Physics",
              "BA Communications"]

  POSITIONS = [ "Engineer", "Analyst", "Big Data Analyts", "Product", "UI/UX"]

  def self.get_position(count)
    pos = POSITIONS[rand(POSITIONS.length)]
    if count == 0
      return pos
    end

    if count <= 2
      return "Senior " + pos
    end

    return "VP " + pos

  end

  def self.get_years
    years = []
    count = rand(6)

    year = Time.zone.now.year
    while count > 0
      year = year - (rand(5) + 1)
      years.push(year)
      count = count - 1
    end

    years.push(Time.zone.now.year) if years.blank?

    years
  end

  def self.add_fake_exp
    min_uni = 1
    max_uni = University.count

    min_employer = Company.order(:id).first.id
    max_employer = Company.count

    #puts max_uni, max_employer

    lorems = []
   
    File.open(Rails.root.join('db/data/li.txt')).each do |l|
      l = l.strip
      next if l.blank?
      lorems.push(l)
    end

    Head.find_each do |head|
      next if head.experiences.count > 0

      years = get_years
      #puts years

      uni = University.find(rand(max_uni - min_uni + 1) + min_uni)

      start_year = years.pop
      end_year = years.last

      stuff = lorems[rand(lorems.length)]

      exp = Experience.new
      exp.place = uni.name
      exp.title = DEGREES[rand(DEGREES.length)]
      exp.exp_type = Experience::EXP_TYPE_SCHOOL
      exp.year_start = start_year
      exp.year_end = end_year
      exp.description = stuff
      exp.head = head
      exp.save!

      puts exp.inspect

      count = 0
      while years.length > 0
        comp = Company.find(rand(max_employer - min_employer + 1) + min_employer)
        start_year = years.pop
        end_year = years.last

        stuff = lorems[rand(lorems.length)]

        exp = Experience.new
        exp.place = comp.name
        exp.title = get_position(count)
        exp.exp_type = Experience::EXP_TYPE_COMPANY
        exp.year_start = start_year
        exp.year_end = end_year
        exp.description = stuff
        exp.head = head
        exp.save!

        puts exp.inspect

        count = count + 1

      end

    end
  end
end
